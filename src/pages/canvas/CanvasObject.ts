export class CanvasObject {


    private behaviours: CanvasBehaviourBase[] = [];
    private animationId: number;
    protected context: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        this.animationId = requestAnimationFrame(this.update);
        this.context = this.canvas.getContext('2d');
    }


    update = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.behaviours.forEach(b => b.onUpdate());
        this.animationId = requestAnimationFrame(this.update);
    }

    dispose() {
        cancelAnimationFrame(this.animationId);
        this.behaviours.forEach(b => b.onDisable());
        this.behaviours = [];
    }

    addBehaviour(behaviour: CanvasBehaviourBase) {
        this.behaviours.push(behaviour);
        behaviour.context = this.context;
        behaviour.onEnable();
    }

}


export class CanvasBehaviourBase {

    context: CanvasRenderingContext2D

    onEnable() {

    }

    onUpdate() {

    }

    onDisable() {

    }

}
