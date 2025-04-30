# SASBINF

## Install

1. Clone repo
2. Download and install dotnet sdk 8.0
3. Download and install npm
4. Run `source macros.sh` on repo root dir inside a Bash terminal.
5. In the same terminal in which you ran `source`, run `install`

## Run (development)

1. In one terminal which sourced `macros.sh`, run `api watch`
2. In **another** terminal which sourced `macros.sh`, run `client dev`

That's it!
The API server started by `api watch` will be available at a localhost URL shown in its terminal.
The client development server started by `client dev` will be available at a localhost URL shown in its terminal.
