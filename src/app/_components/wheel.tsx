import { useEffect, useRef } from "react";
interface Props {
    elements: string[];
}
const Wheel = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext("2d")!
        let angle = (2 / props.elements.length) * Math.PI
        drawWheel(ctx, 0, angle, "white", "black")
        drawWheel(ctx, angle, angle * 2, "red", "black")
    })
    
    function drawWheel(ctx: CanvasRenderingContext2D, startAngle: number,angle: number, fill: string, stroke: string) {
        ctx.beginPath();
        ctx.arc(window.innerWidth / 4, window.innerHeight /4, 200, startAngle, angle);
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