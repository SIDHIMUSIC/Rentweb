
import {connectDB} from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET(){
  await connectDB();
  let rooms = await Room.find();
  if(!rooms.length){
    let arr=[];
    for(let f=1;f<=3;f++){
      for(let r=1;r<=10;r++){
        arr.push({roomNumber:`F${f}-R${r}`});
      }
    }
    await Room.insertMany(arr);
    rooms = await Room.find();
  }
  return Response.json(rooms);
}
