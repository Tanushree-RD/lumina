# Lumina Dev Server

## Prerequisites
- Node.js installed
- Dependencies already in `node_modules/`

## Starting the Server

From the main checkout (`C:\Users\ACER\lumina`), run:

```powershell
Start-Process cmd.exe -ArgumentList '/c C:\Users\ACER\lumina\.freebuff\start-dev.bat' -WindowStyle Hidden
```

Or manually:

```bash
node node_modules\next\dist\bin\next dev
```

Next.js will start on an available port (check `.freebuff/preview-*.log` for the port).

## Notes
- Turbopack is enabled by default
- Build: `npm run build`
- Lint: `npm run lint`
- The `.freebuff/start-dev.bat` script redirects stdout/stderr to the log files
