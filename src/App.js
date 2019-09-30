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
  {width:15,height:15,mines:50},
  {width:20,height:20,mines:100},
]

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: levels[0].width,
      height: levels[0].height,
      mines: levels[0].mines,
      board: [],
      finished: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.newGame = this.newGame.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
  }

  async handleClick(e) {
    e.preventDefault();

    if(this.state.finished){
      console.log("Game over");
      return;
    }
    //LEFT CLICK
    if(e.type==="click"){
      //HANDLE FIELDS WITHOUT FLAG
      if(!e.target.hasAttribute("flag")){
        let value = this.state.board[e.target.dataset.index]

        if(value===-1){
          //GAME OVER
          e.target.classList.add("bomb");
          this.setState({...this.state, finished:true})
        } if(value>=0){
          e.target.classList.add("good");
          if(value===0){
            //REVEAL ALL ZEROS
            let empty = this.revealEmpty(e.target.dataset.index);
            let max = empty.length;
            for(let i = 0; i < max; i++){
              if(this.state.board[empty[i]]===0){
                let n = this.revealEmpty(empty[i]);
                empty = empty.concat(n);
                empty = empty.filter((num,index,arr)=>arr.indexOf(num)===index)
                max = empty.length;
              }
            }
            empty.forEach((el)=>{
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
        this.setState({...this.state,finished:true});
        console.log("Win")
      }

    } else if(e.type==="contextmenu"){
      //RIGHT CLICK
      if(!e.target.hasAttribute("flag")){
        e.target.setAttribute("flag","")
      } else {
        e.target.removeAttribute("flag");
      }
    }
  }

  componentDidMount(){
    this.newGame()
  }

  revealEmpty(index){
    const row = Math.floor(index / this.state.height);
    const col = index % this.state.width;
    index = parseInt(index,10);

    let coordinates = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]
    if(row===0){
      coordinates = coordinates.filter(item=>{
        return item[1]!==-1
      })
    }
    if(row===this.state.height-1){
      coordinates = coordinates.filter(item=>{
        return item[1]!==1
      })
    }
    if(col===0){
      coordinates = coordinates.filter(item=>{
        return item[0]!==-1
      })
    }
    if(col===this.state.width-1){
      coordinates = coordinates.filter(item=>{
        return item[0]!==1
      })
    }

    
    return coordinates
    .map(current=>( row + current[1] )* this.state.width + col + current[0])
    .filter(current=>this.state.board[current]!==-1)
    .filter(current=>![...document.querySelector(`.board button[data-index='${current}']`).classList].includes("good"))

  }

  changeLevel(e){
    const selected = e.target.options.selectedIndex;
    this.setState({
      ...this.state,
      width: levels[selected].width,
      height: levels[selected].height,
      mines: levels[selected].mines
    })
  }

  newGame(){
    document.querySelector(".board").setAttribute("style",`--col:${this.state.width}`)
    this.setState({
      ...this.state,
      finished:false,
      board: minesweeper(this.state.width, this.state.height, this.state.mines)
    });
    [...document.querySelectorAll(".board button")].map(button=>{
      button.classList.remove(...button.classList);
      button.innerHTML = "";
      button.removeAttribute("flag");
      return button;
    });
  }

  render() {
    return (
      <div className="App">
        <div className="board">
          {this.state.board.map((item,index)=>{
            return <Cell key={index} onClick={this.handleClick} index={index} flag></Cell>
          })}
        </div>
        <div className="menu">
          <select name="" id="" onChange={this.changeLevel}>
            <option value="1">EASY (10x10 / 10 mines)</option>
            <option value="2">MEDIUM (30x30 / 50 mines)</option>
            <option value="3">HARD (50x50 / 1000mines)</option>
          </select>
          <button onClick={this.newGame}>Reset</button>
        </div>
      </div>
    );
  }
}

