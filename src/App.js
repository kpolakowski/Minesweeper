import React from "react";
import "./App.scss";
import minesweeper from "./minesweeper";

const Cell = props => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      onContextMenu={props.onClick}
      data-index={props.index}
    ></button>
  );
};



const levels = [
  {width:10,height:10,mines:10},
  {width:15,height:15,mines:30},
  {width:20,height:20,mines:50},
]

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      width: levels[0].width,
      height: levels[0].height,
      mines: levels[0].mines,
      board: [],
      time:0,
      finished: false
    };

    this.timer = 0;
    this.getDiffTime = this.getDiffTime.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.newGame = this.newGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
  }

  componentDidMount(){
    //START NEW GAME ON LOADING
    this.newGame()
  }

  gameOver(won){
    this.setState({...this.state, finished:true})
    clearInterval(this.timer);
    if(!won){
      console.log("Game over",`Your time is ${this.getDiffTime()}`);
      document.querySelector(".lost").classList.add("visible");
    } else{
      console.log("You have won",`Your time is ${this.getDiffTime()}`);
      document.querySelector(".win").classList.add("visible");
      document.querySelector(".win span").innerHTML = this.getDiffTime();
    }
    
  }

  handleClick(e) {
    e.preventDefault();

    if(this.state.finished){
      console.log("Game has already finished");
      return;
    }

    //HANDLE LEFT CLICK
    if(e.type==="click"){
      //HANDLE ONLY FIELDS WITHOUT FLAG
      if(!e.target.hasAttribute("flag")){
        let value = this.state.board[e.target.dataset.index]

        if(value===-1){

          //BOMB CLICKED, GAME OVER
          e.target.classList.add("bomb");
          this.gameOver(false);

        } if(value>=0){
          //NON BOMB CLICKED
          e.target.classList.add("good");
          if(value===0){
            //REVEAL ALL NON BOMB FIELDS AROUND
            let nonbombs = this.revealEmpty(e.target.dataset.index);
            for(let i = 0; i < nonbombs.length; i++){
              //IF FIELD IS EMPTY, REVEAL OTHERS AROUND IT
              if(this.state.board[nonbombs[i]]===0){
                let n = this.revealEmpty(nonbombs[i]);
                nonbombs = nonbombs.concat(n);
                //REMOVE DUPLICATES
                nonbombs = nonbombs.filter((num,index,arr)=>arr.indexOf(num)===index)
              }
            }
            nonbombs.forEach((el)=>{
              document.querySelector(`.board button[data-index='${el}']`).classList.add("good");
              document.querySelector(`.board button[data-index='${el}']`).innerHTML = this.state.board[el]===0 ? "" : this.state.board[el];
            })
          } else{
            e.target.innerHTML = value
          }
        } 
      }

      //CHECK IF WON
      if(document.querySelectorAll(".board button[class='good']").length === this.state.height * this.state.width - this.state.mines){
        this.gameOver(true);
      }

    } else if(e.type==="contextmenu"){
      // HANDLE RIGHT CLICK
      if(!e.target.hasAttribute("flag") && ![...e.target.classList].includes("good")){
        e.target.setAttribute("flag","") //SET FLAG
      } else {
        e.target.removeAttribute("flag"); //REMOVE FLAG
      }
    }
  }

  

  revealEmpty(index){
    const row = Math.floor(index / this.state.height);
    const col = index % this.state.width;
    index = parseInt(index,10);

    let emptyFields = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]
    if(row===0){
      emptyFields = emptyFields.filter(field=>{
        return field[1]!==-1
      })
    }
    if(row===this.state.height-1){
      emptyFields = emptyFields.filter(field=>{
        return field[1]!==1
      })
    }
    if(col===0){
      emptyFields = emptyFields.filter(field=>{
        return field[0]!==-1
      })
    }
    if(col===this.state.width-1){
      emptyFields = emptyFields.filter(field=>{
        return field[0]!==1
      })
    }

    
    return emptyFields
    .map(current=>( row + current[1] )* this.state.width + col + current[0])
    .filter(current=>this.state.board[current]!==-1)
    .filter(current=>![...document.querySelector(`.board button[data-index='${current}']`).classList].includes("good"))

  }

  changeLevel(e){
    const selected = e.target.options.selectedIndex;
    //UPDATING STATE WITH CURRENTLY CHOSEN LEVEL
    this.setState({
      ...this.state,
      width: levels[selected].width,
      height: levels[selected].height,
      mines: levels[selected].mines
    })
  }

  newGame(){
    [...document.querySelectorAll(".messages div")].forEach(el=>el.classList.remove("visible"));
    //SET NEW WIDTH OF ROW
    document.querySelector(".board").setAttribute("style",`--col:${this.state.width}`)
    //GENERATING NEW BOARD WITH VALUES FROM STATE
    this.setState({
      ...this.state,
      finished:false,
      time:new Date().getTime(),
      board: minesweeper(this.state.width, this.state.height, this.state.mines)
    });
    //RESET ALL THE BUTTONS
    [...document.querySelectorAll(".board button")].map(button=>{
      button.classList.remove(...button.classList);
      button.innerHTML = "";
      button.removeAttribute("flag");
      return button;
    });

    this.timer = setInterval(async ()=>{
      document.querySelector("#timer span").innerHTML = this.getDiffTime();
    },1000)
    
  }

  getDiffTime(){
    const diff = Math.floor((new Date().getTime() - this.state.time) / 1000);
    const seconds = diff % 60 < 10 ? "0"+diff%60 : diff % 60;
    const minutes = Math.floor(diff / 60) < 10 ? "0"+Math.floor(diff/60) : Math.floor(diff / 60);
    return `${minutes}:${seconds}`;
  }

  render() {
    return (
      <div className="App">
        <div className="messages">
          <div className="win">Congratulation you have won!<br/>Your time is <span>00:00</span></div>
          <div className="lost">You have lost!</div>
        </div>
        
        <div className="board">
          {this.state.board.map((item,index)=>{
            return <Cell key={index} onClick={this.handleClick} index={index} flag></Cell>
          })}
        </div>

        <div className="menu">
          <p id="timer">Time<span>00:00</span></p>
          <select name="" id="" onChange={this.changeLevel}>
            <option value="1">EASY (10x10 / 10 mines)</option>
            <option value="2">MEDIUM (15x15 / 30 mines)</option>
            <option value="3">HARD (20x20 / 50 mines)</option>
          </select>
          <button onClick={this.newGame}>Reset</button>
        </div>

      </div>
    );
  }
}

