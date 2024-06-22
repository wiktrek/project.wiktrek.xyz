import { useEffect, useRef } from "react";
interface Props {
    elements: string[];
}
const Wheel = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const colors = ["white", "red", "green", "yellow", "blue", "aqua"]
    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext("2d")!
        let angle = (2 / props.elements.length) * Math.PI
        props.elements.map((element, i) => {
            console.log(angle, i,angle * i, angle * (i + 1))
            drawWheel(ctx,angle * i, angle * (i + 1), colors[i]!, "black", 200)
            drawText(ctx, element, angle * i, angle * (i + 1))
        })
        drawWheel(ctx, 0, 2 * Math.PI, "white", "black", 60)
    })
    function drawText(ctx: CanvasRenderingContext2D,text: string, startAngle: number,angle: number) {
        const y = window.innerHeight /4
        const x = window.innerWidth / 4
        ctx.fillStyle = "white"
        ctx.font = "32px Arial";
        ctx.fillText(text, x + text.length * 20, y + text.length * 20);
        
    }
    function drawWheel(ctx: CanvasRenderingContext2D, startAngle: number,angle: number, fill: string, stroke: string, radius: number) {
        const y = window.innerHeight /4
        const x = window.innerWidth / 4
        ctx.beginPath();
        if (angle != 2 * Math.PI || startAngle != 0) {
            ctx.moveTo(x, y);
        }
        ctx.arc(x, y, radius, startAngle, angle);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.stroke();
    } 
    return (
        <canvas ref={canvasRef} width={window.innerWidth / 2} height={window.innerHeight / 2} className="mx-auto">Can't load canvas...</canvas>
    )
}
export default Wheel;