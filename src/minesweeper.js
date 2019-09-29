module.exports = (w, h, m) => {
  const field = [];
  for (let i = 0; i < w * h; i++) {
    field.push(0);
  }

  // GENERATE MINES
  for (let i = 0; i < m; i++) {
    let row, col;
    // if item is already -1, x and y indexes are generated again
    do {
      row = Math.floor(Math.random() * w);
      col = Math.floor(Math.random() * h);
    } while (field[row*h + col] === -1);
    // if it is 0, than it is changed to -1
    field[row*h+col] = -1;
  }
 
  // COUNTING MINES AROUND
  for (let i = 0; i < w * h; i++) {
    // coordinates of currently checked item
    let col = (i % w);
    let row = Math.floor(i / w);
    // 0 INDICATES THAT THERE IS NO MINE ON THAT FIELD
    if(field[row*w+col]===0){ 
      // COORDINATES OF EACH ELEMENT AROUND CURRENT FIELD
      let coordinates = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]
      // [-1,-1] [0,-1] [1,-1]
      // [-1, 0] [ EL ] [1, 0]
      // [-1, 1] [0, 1] [1, 1]
      if(row===0){
        //DONT CHECK UPPER ROW
        coordinates = coordinates.filter(item=>{
          return item[1]!==-1
        })
      }
      if(row===Math.floor(field.length/w)-1){
        //DONT CHECK LOWER ROW
        coordinates = coordinates.filter(item=>{
          return item[1]!==1
        })
      }
      if(col===0){
        //DONT CHECK LEFT COLUMN
        coordinates = coordinates.filter(item=>{
          return item[0]!==-1
        })
      }
      if(col===Math.floor(field.length/h)-1){
        //DONT CHECK RIGHT COLUMN
        coordinates = coordinates.filter(item=>{
          return item[0]!==1
        })
      }
      // WE COUNT NEW VALUE BY CHECKING IF FIELDS AROUND HAVE MINE (THEY EQUAL TO -1)
      field[row*w+col] = coordinates.reduce((acc,current)=>field[ ( row + current[1] )* w + col + current[0] ] === -1 ? ++acc : acc, 0)
    }

  }
  console.log(field.length,field)
  return field;
};