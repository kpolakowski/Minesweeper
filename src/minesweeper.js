module.exports = (width, height, mines) => {
  const mineField = [];
  for (let i = 0; i < width * height; i++) {
    mineField.push(0);
  }
  //0 INDICATES THAT THERE IS NO MINE ON FIELD

  // GENERATE MINES
  for (let i = 0; i < mines; i++) {
    let row, col;
    // if item is already -1, x and y indexes are generated again
    do {
      row = Math.floor(Math.random() * width);
      col = Math.floor(Math.random() * height);
    } while (mineField[row*height + col] === -1);
    // if it is 0, than it is changed to -1
    mineField[row*height+col] = -1;
  }
  //-1 INDICATES THAT THERE IS MINE ON FIELD
 
  // COUNTING MINES AROUND
  for (let i = 0; i < width * height; i++) {
    // fieldsAround of currently checked item
    let col = (i % width);
    let row = Math.floor(i / width);
    // 0 INDICATES THAT THERE IS NO MINE ON THAT FIELD
    if(mineField[row*width+col]===0){ 
      // COORDINATES OF EACH ELEMENT AROUND CURRENT FIELD
      let fieldsAround = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]
      // [-1,-1] [0,-1] [1,-1]
      // [-1, 0] [ EL ] [1, 0]
      // [-1, 1] [0, 1] [1, 1]
      if(row===0){
        //EXCLUDE UPPER ROW (WITH SECOND VALUE EQUAL TO -1)
        fieldsAround = fieldsAround.filter(field=>{
          return field[1]!==-1
        })
      }
      if(row===Math.floor(mineField.length/width)-1){
        //EXCLUDE LOWER ROW (WITH SECOND VALUE EQUAL TO 1)
        fieldsAround = fieldsAround.filter(field=>{
          return field[1]!==1
        })
      }
      if(col===0){
        //EXCLUDE LEFT COLUMN (WITH FIRST VALUE EQUAL TO -1)
        fieldsAround = fieldsAround.filter(field=>{
          return field[0]!==-1
        })
      }
      if(col===Math.floor(mineField.length/height)-1){
        //EXCLUDE RIGHT COLUMN (WITH FIRST VALUE EQUAL TO 1)
        fieldsAround = fieldsAround.filter(field=>{
          return field[0]!==1
        })
      }
      // WE COUNT NEW VALUE BY CHECKING IF FIELDS AROUND HAVE MINE (IF THEY EQUAL TO -1 THEN WE INCREMENT THE COUNTER)
      mineField[row*width+col] = fieldsAround.reduce((acc,current)=>mineField[ ( row + current[1] )* width + col + current[0] ] === -1 ? ++acc : acc, 0)
    }

  }
  return mineField;
};