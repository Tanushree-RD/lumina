"use client";

import * as tf from "@tensorflow/tfjs";
import { TrainingMetrics } from "@/types";
import { genSynthLC } from "./astronomy/lightcurve-math";

export interface TrainCNNCallbacks {
  onEpochEnd: (metrics: TrainingMetrics, samplesPerSec: number) => void;
  onBatchEnd?: (batch: number, loss: number, acc: number) => void;
}

// Global reference to the in-browser trained model
let activeCNNModel: tf.LayersModel | null = null;
let activeCNNTrainedN: number | null = null;

export function getActiveCNNModel(): { model: tf.LayersModel | null; trainedN: number | null } {
  return { model: activeCNNModel, trainedN: activeCNNTrainedN };
}

export function setActiveCNNModel(model: tf.LayersModel | null, trainedN: number | null) {
  if (activeCNNModel && activeCNNModel !== model) {
    try {
      activeCNNModel.dispose();
    } catch {
      // ignore
    }
  }
  activeCNNModel = model;
  activeCNNTrainedN = trainedN;
}

/**
 * Z-score normalization for raw flux sequence.
 */
export function normalizeCurve(raw: number[]): number[] {
  if (!raw || raw.length === 0) return [];
  const mean = raw.reduce((a, b) => a + b, 0) / raw.length;
  const sd =
    Math.sqrt(
      raw.reduce((a, v) => a + (v - mean) ** 2, 0) / raw.length
    ) || 1e-6;
  return raw.map((v) => (v - mean) / sd);
}

/**
 * Builds 1D CNN with input shape [N, 1] matching exoplanet-app architecture.
 */
export function buildCNN(pointCount: number): tf.Sequential {
  const m = tf.sequential();
  m.add(
    tf.layers.conv1d({
      inputShape: [pointCount, 1],
      filters: 16,
      kernelSize: 7,
      padding: "same",
      activation: "relu",
    })
  );
  m.add(tf.layers.maxPooling1d({ poolSize: 2 }));
  m.add(
    tf.layers.conv1d({
      filters: 32,
      kernelSize: 5,
      padding: "same",
      activation: "relu",
    })
  );
  m.add(tf.layers.maxPooling1d({ poolSize: 2 }));
  m.add(
    tf.layers.conv1d({
      filters: 64,
      kernelSize: 3,
      padding: "same",
      activation: "relu",
    })
  );
  m.add(tf.layers.globalAveragePooling1d({}));
  m.add(tf.layers.dense({ units: 32, activation: "relu" }));
  m.add(tf.layers.dropout({ rate: 0.3 }));
  m.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  return m;
}

/**
 * Generates synthetic positive & negative light curves normalized by Z-score.
 */
export function makeDataset(count: number, pointCount: number): { X: number[][]; Y: number[] } {
  const X: number[][] = [];
  const Y: number[] = [];
  for (let i = 0; i < count; i++) {
    const hasTransit = Math.random() < 0.5;
    X.push(normalizeCurve(genSynthLC(hasTransit, pointCount)));
    Y.push(hasTransit ? 1 : 0);
  }
  return { X, Y };
}

/**
 * Trains the CNN in-browser using TensorFlow.js with real-time per-epoch streaming.
 */
export async function trainExoplanetCNN(
  sampleCount: number,
  epochs: number,
  learningRate: number,
  pointCount: number,
  callbacks: TrainCNNCallbacks
): Promise<{ model: tf.LayersModel; finalValAccuracy: number }> {
  await tf.ready();

  const trn = makeDataset(sampleCount, pointCount);
  const valCount = Math.max(100, Math.round(sampleCount * 0.25));
  const val = makeDataset(valCount, pointCount);

  const xsTr = tf.tensor3d(trn.X.map((c) => c.map((v) => [v])));
  const ysTr = tf.tensor2d(trn.Y.map((v) => [v]));
  const xsVa = tf.tensor3d(val.X.map((c) => c.map((v) => [v])));
  const ysVa = tf.tensor2d(val.Y.map((v) => [v]));

  const model = buildCNN(pointCount);
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  let finalValAcc = 0.92;
  const epochTimes: number[] = [];

  try {
    await model.fit(xsTr, ysTr, {
      epochs,
      batchSize: 32,
      validationData: [xsVa, ysVa],
      shuffle: true,
      callbacks: {
        onEpochBegin: () => {
          epochTimes.push(performance.now());
        },
        onEpochEnd: async (epoch, logs) => {
          const tStart = epochTimes[epoch] || performance.now() - 100;
          const tEnd = performance.now();
          const epochDurationMs = Math.max(1, tEnd - tStart);
          const samplesPerSec = Math.round(
            sampleCount / (epochDurationMs / 1000)
          );

          const loss = Number(logs?.loss?.toFixed(4) || 0);
          const acc = Number((logs?.acc ?? logs?.accuracy ?? 0).toFixed(4));
          const valLoss = Number(logs?.val_loss?.toFixed(4) || 0);
          const valAcc = Number((logs?.val_acc ?? logs?.val_accuracy ?? 0).toFixed(4));

          finalValAcc = valAcc;

          callbacks.onEpochEnd(
            {
              epoch: epoch + 1,
              loss,
              accuracy: acc,
              valLoss,
              valAccuracy: valAcc,
            },
            samplesPerSec
          );

          await tf.nextFrame();
        },
      },
    });

    setActiveCNNModel(model, pointCount);

    try {
      await model.save("indexeddb://lumina-exoplanet-cnn");
    } catch (saveErr) {
      console.warn("Could not save to indexeddb:", saveErr);
    }
  } finally {
    xsTr.dispose();
    ysTr.dispose();
    xsVa.dispose();
    ysVa.dispose();
  }

  return { model, finalValAccuracy: finalValAcc };
}

/**
 * Predicts transit likelihood using the trained CNN on a raw light curve.
 */
export function predictCNN(raw: number[]): number | null {
  if (!activeCNNModel || !raw || raw.length === 0) return null;
  const norm = normalizeCurve(raw);
  return tf.tidy(() => {
    const x = tf.tensor3d([norm.map((v) => [v])]);
    const pred = activeCNNModel!.predict(x) as tf.Tensor;
    return pred.dataSync()[0];
  });
}
