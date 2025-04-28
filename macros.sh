# Install the toolchain
function install() {
    # Install the client dependencies
    cd ClientApp
    npm install
    cd -
}

# For running commands like `dotnet watch --project api` as `api watch`
function api() {
    dotnet $@ --project api
}

# Run, build, lint or preview the frontend
# Run this function like the following:
# - client dev => run the client in dev mode
# - client build => build the client for production
# - client lint => run the linter on the client
# - client preview => preview the client in production mode
function client() {
    cd ClientApp
    npm run $1
    cd -
}
