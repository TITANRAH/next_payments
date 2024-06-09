import { client } from '@/libs/mercadopago';
import { Payment } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
 
 
export async function GET(request: NextRequest) {
// paso el payment id y veo el estado apuntndo a la ruta en el nav
    const payment = await new Payment(client).get({
        id: '1318509594'
    });
 
return NextResponse.json(payment)
 
}