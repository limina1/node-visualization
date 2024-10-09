var seed = 1;
export default function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
