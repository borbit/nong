function require(path) {
    path = path.replace('../', '');
    path = path.replace('./', '');
    path = path.split('/');

    var capitalized = path[0].charAt(0).toUpperCase() + path[0].slice(1);
    var result = window[capitalized];

    if (typeof(result) == 'undefined') {
        result = window.Pong;
    }
    return result;
}