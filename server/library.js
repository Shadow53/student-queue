/**
 * Created by michael on 5/9/16.
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    capitalize: capitalize
};