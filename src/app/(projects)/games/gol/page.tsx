"use client"
interface Point {
    x: number;
    y: number;
}
// 
// check only alive cells because the dead ones cant update anything i think
// 
class Cell {
    isAlive: boolean;
    x: number;
    y: number;
    constructor(x: number,y: number) {
        this.isAlive = false;
        this.y = y;
        this.x = x;
    }
    listNeighbors(): Point[] {
        return [
            {x: this.x-1, y: this.y+1},
            {x: this.x, y: this.y+1},
            {x: this.x+1, y: this.y+1},
            {x: this.x-1, y: this.y},
            {x: this.x+1, y: this.y},
            {x: this.x-1, y: this.y-1},
            {x: this.x, y: this.y-1},
            {x: this.x+1, y: this.y-1},
        ]
    }
}
class Game {
    grid: Cell[][];
    size: number;
    constructor(size: number) {
        let grid: Cell[][] = [];
        this.size = size;
        for (let i = 0;i<this.size;i++) {
            grid.push([])
            for (let j = 0;j<this.size;j++) {
                grid[i]?.push(new Cell(i,j));
            }
        }
        this.grid = grid;
    }
    draw(canvas: HTMLCanvasElement) {
        // draw grid alive = green dead = gray
        let ctx = canvas.getContext("2d")!
        let h = canvas.height;
        let w = canvas.width;
        for (let i = 0;i<this.size;i++) {
            let x1 = w / this.size*i;
            for (let j = 0;j<this.size;j++) {
                let y1 = h / this.size*j;
                ctx.fillStyle = "GRAY"
                if (this.grid[i]![j]!.isAlive) ctx.fillStyle = "GREEN"
                ctx.fillRect(x1, y1,x1+this.size, y1+this.size);
            }
        }
        for (let i = 0;i<this.size;i++) {
            let x = w / this.size * i;
            let y1 = 0;
            let y2 = h;
            ctx.moveTo(x, y1);
            ctx.lineTo(x,y2);
            ctx.stroke()
        }
        for (let i = 0;i<this.size;i++) {
            let y = h / this.size * i;
            let x1 = 0;
            let x2 = w;
            ctx.moveTo(x1, y);
            ctx.lineTo(x2,y);
            ctx.stroke()
        }
    }
    getClick(event: MouseEvent, canvas: HTMLCanvasElement): Point {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return {
            x: x,
            y: y,
        } as Point;
    }
}
export default function Page() {
    let game = new Game(50);
    function start() {
        let canvas = document.getElementById("c") as HTMLCanvasElement;  
        game.draw(canvas)
    }

    return (
    <main className="flex flex-col items-center justify-center text-center">
        <canvas id="c" width={1000} height={1000} onMouseDown={(e) => game.getClick(e.nativeEvent, e.currentTarget)}></canvas>
        <button onClick={start}>RENDER ALL</button>
    </main>
  );
}