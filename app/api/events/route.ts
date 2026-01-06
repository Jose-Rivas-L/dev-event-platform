import { v2 as cloudinary } from 'cloudinary';
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
    try{
        await connectDB();

        const formData = await req.formData();

        let event;

        try{
            event = Object.fromEntries(formData);
        }
        catch( e){
            return NextResponse.json({message: 'Invalid Form Data', error: e instanceof Error ? e.message: 'Unknown error'})
        }

        const file = formData.get('image') as File;

        if(!file){
            return NextResponse.json({message: 'Image file is required'});
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) =>{
            cloudinary.uploader.upload_stream({ resource_type: 'image' , folder:'DevEvent'}, (error, results) =>{
                if(error) return reject(error);

                resolve(results);
            }).end(buffer)
        });

        const tags = JSON.parse(formData.get('tags') as string);
        const agenda = JSON.parse(formData.get('agenda') as string);

        event.image = (uploadResult as { secure_url: string}).secure_url;

        const createdEvent = await Event.create({...event, tags, agenda});

        return NextResponse.json({message: 'Event created successfully', event: createdEvent }, {status: 201});
    }
    catch (e){
        console.error(e);
        return NextResponse.json({message: 'Event Creation Failed', error: e instanceof Error ? e.message: 'Unknown error'})
    }
}

export async function GET() {
    try{
        await connectDB();

        const events =  await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({message: 'Events fetched successfully', events: events}, {status: 200});

    }
    catch (e){
        return NextResponse.json({message: 'Failed to fetch events', error: e instanceof Error ? e.message: 'Unknown error'})
    }
}