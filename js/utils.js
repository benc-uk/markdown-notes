
function makeId(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var start = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  text += start.charAt(Math.floor(Math.random() * possible.length))
  for (var i = 0; i < len-1; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
