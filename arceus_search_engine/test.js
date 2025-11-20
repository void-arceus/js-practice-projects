let map = new Map([
  ["name", "void_arceus"], 
  ["age", "22"]
]); 

console.log(map.get("name")); 
let prev_age = map.get("age"); 
console.log(prev_age); 

map.set("age", Number(prev_age) + 1); 
console.log(map); 