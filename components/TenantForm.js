
"use client";
import {useState} from "react";

export default function TenantForm(){
  const [f,setF]=useState({name:"",phone:"",roomNumber:""});
  const submit=async(e)=>{
    e.preventDefault();
    await fetch("/api/tenants",{method:"POST",body:JSON.stringify(f)});
    alert("Added");
    location.reload();
  };
  return(
    <form onSubmit={submit} className="space-y-2">
      <input className="border p-2 w-full" placeholder="Name" onChange={e=>setF({...f,name:e.target.value})}/>
      <input className="border p-2 w-full" placeholder="Phone" onChange={e=>setF({...f,phone:e.target.value})}/>
      <input className="border p-2 w-full" placeholder="Room F1-R1" onChange={e=>setF({...f,roomNumber:e.target.value})}/>
      <button className="bg-green-500 text-white px-4 py-2">Add</button>
    </form>
  )
}
