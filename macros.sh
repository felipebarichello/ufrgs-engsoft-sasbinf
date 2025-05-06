# Install the toolchain
function install() {
    # Install the client dependencies
    cd ClientApp
    npm install
    cd ..
}

# For running commands like `dotnet watch --project api` as `api watch`
function api() {
    dotnet $@ --project api
}

# Execute npm commands in the ClientApp directory
# Use `client run` to run, build, lint or preview the frontend
# For that, run this function like the following:
# - client run dev => run the client in dev mode
# - client run build => build the client for production
# - client run lint => run the linter on the client
# - client run preview => preview the client in production mode
function client() {
    npm --prefix ./ClientApp $@
}
