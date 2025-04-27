# For running commands like `dotnet watch --project api` as `api watch`
function api() {
    dotnet $@ --project api
}
