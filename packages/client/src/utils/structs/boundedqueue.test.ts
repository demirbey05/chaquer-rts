import {describe,expect,test,beforeEach} from "@jest/globals"
import { BoundedQueue } from "./BoundedQueue"


describe("fundamental operations",()=> {
    let queue:BoundedQueue<number>;
    beforeEach(()=>{
        queue = new BoundedQueue(5)

    })
    test("adds element to queue",()=> {
        queue.enqueue(15)
        expect(queue.length).toBe(1)
        expect(queue.dequeue()).toBe(15)
        
    })
})