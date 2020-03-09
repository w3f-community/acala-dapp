const { override } = require("customize-cra");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const path = require("path");

module.exports = override(function(config, env) {
    // remove ModuleScoplePlugin
    config.resolve.plugins = config.resolve.plugins.filter(
        plugin => !(plugin instanceof ModuleScopePlugin)
    );
    config.resolve.alias = {
        "@honzon-platform/apps": path.resolve(__dirname, "src"),
        "@honzon-platform/hooks": path.resolve(__dirname, "../react-hooks/src")
    };
    return config;
});
