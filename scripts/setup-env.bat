@echo off
REM Setup environment files for Zesdocs development
echo 🔧 Setting up environment files for Zesdocs development...

REM Function to copy env.example to .env if it doesn't exist
:copy_env_file
set workspace=%1
set env_file=%workspace%\env.example
set target_file=%workspace%\.env

if exist "%env_file%" (
    if not exist "%target_file%" (
        copy "%env_file%" "%target_file%" >nul
        echo ✅ Created %target_file%
    ) else (
        echo ⚠️  %target_file% already exists, skipping...
    )
) else (
    echo ❌ %env_file% not found, skipping...
)
goto :eof

REM Copy environment files for each workspace
echo 📁 Copying environment files...

call :copy_env_file "apps\api"
call :copy_env_file "apps\web"
call :copy_env_file "apps\indexer"
call :copy_env_file "apps\extension"
call :copy_env_file "apps\mobile"
call :copy_env_file "packages\shared"
call :copy_env_file "infra"

REM Create root .env file
if not exist ".env" (
    copy "env.example" ".env" >nul
    echo ✅ Created root .env file
) else (
    echo ⚠️  Root .env already exists, skipping...
)

echo.
echo 🎉 Environment setup complete!
echo.
echo 📝 Next steps:
echo 1. Review and update the .env files in each workspace
echo 2. Update the root .env file with your specific configuration
echo 3. Start the infrastructure: cd infra ^&^& pnpm run dev:start
echo 4. Start the applications: pnpm run dev
echo.
echo 🔐 Important: Update all JWT_SECRET and API keys before running in production!
pause
