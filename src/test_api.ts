const text =
  "なので、正直雨の中傘をささずに一人途方に暮れたようにしている姿を見かけた時は、何をやっているんだと不審者を見るような眼差しになってしまった。";

fetch("http://localhost:3000/tokenize", {
  method: "POST",
  body: JSON.stringify({ text }),
  headers: { "Content-Type": "application/json" },
}).then(async (response) => {
  const body = await response.json();
  console.log("Response:", body);
});

console.log("TEst");
