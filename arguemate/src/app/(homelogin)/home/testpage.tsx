import { prisma } from "@/db";
import Client from "./client";

export default async function Home() {
    const users  = await prisma.user.findMany();


    return <div>
     {   users.map((user) => (
        <div>
            {user.name}, {user.email}
        </div>
        )
     
         )}

         <Client></Client>
    </div>
}