import axios from 'axios'
import FormData from 'form-data'

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MmUzNjU1OS0wMjllLTQ5OTctYmJlOS02NDAxMGNhNzY2YWYiLCJlbWFpbCI6Im9ta2FyamFkaGF2MjEwM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2Y1OTcyOGU1MjRhNjQ4ZDQ0OTkiLCJzY29wZWRLZXlTZWNyZXQiOiJiYTk4NDQ3MjAyOGM1MzI5NjU0MDZlMGI2YjA0YWJiZTZkODlhOWQzODA5ZWQ1YTc3M2NjNjRlOWQ1MmQ0ZWEwIiwiaWF0IjoxNjk1Mjk2NTQyfQ`,
            'Content-Type': 'application/json',
        },
        data: {
            pinataOptions: { cidVersion: 0 },
            pinataMetadata: { name: 'ip-metadata.json' },
            pinataContent: jsonMetadata,
        },
    }

    try {
        const response = await axios(url, options)
        return response.data.IpfsHash
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error)
        throw error
    }
}

export async function uploadTextToIPFS(text: string): Promise<string> {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
    const data = new FormData()
    const buffer = Buffer.from(text, 'utf-8')
    data.append('file', buffer, { filename: 'dispute-evidence.txt', contentType: 'text/plain' })

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MmUzNjU1OS0wMjllLTQ5OTctYmJlOS02NDAxMGNhNzY2YWYiLCJlbWFpbCI6Im9ta2FyamFkaGF2MjEwM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2Y1OTcyOGU1MjRhNjQ4ZDQ0OTkiLCJzY29wZWRLZXlTZWNyZXQiOiJiYTk4NDQ3MjAyOGM1MzI5NjU0MDZlMGI2YjA0YWJiZTZkODlhOWQzODA5ZWQ1YTc3M2NjNjRlOWQ1MmQ0ZWEwIiwiaWF0IjoxNjk1Mjk2NTQyfQ`,
            ...data.getHeaders(),
        },
        data: data,
    }

    try {
        const response = await axios(url, options)
        return response.data.IpfsHash
    } catch (error) {
        console.error('Error uploading text to IPFS:', error)
        throw error
    }
}
