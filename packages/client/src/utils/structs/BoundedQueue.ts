export class BoundedQueue<T> {
    private elements : T[]
    public length:number
    public head:number
    public tail:number
    public maxsize:number

    constructor(maxsize:number){
        this.elements = [];
        this.length = 0;
        this.head = 0;
        this.tail = 0;
        this.maxsize = maxsize
    }
    private _enqueue(element:T){
        this.elements[this.tail] = element
        this.tail++
        this.length++
    }
    private _dequeue(){
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        this.length--;
        return item;

    }

    public enqueue(element:T){
        if(this.length == this.maxsize-1){
            this._dequeue()
            this._enqueue(element)
        } else {
            this._enqueue(element)
        }
    }
    public dequeue(){
        if(this.length == 0 ){
            return
        }else {
            this._dequeue()
        }

    }
    peek() {
        return this.elements[this.head];
    }
    get isEmpty(){
        return this.length === 0

    }
    get data(){
        return this.elements
    }
}