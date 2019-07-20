param (
  [string] $token
)

$Env:GH_TOKEN = $token

npm run publish