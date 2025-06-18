// import axios from 'axios'
// import FormData from 'form-data'

// export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
//     const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
//     const options = {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MmUzNjU1OS0wMjllLTQ5OTctYmJlOS02NDAxMGNhNzY2YWYiLCJlbWFpbCI6Im9ta2FyamFkaGF2MjEwM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2Y1OTcyOGU1MjRhNjQ4ZDQ0OTkiLCJzY29wZWRLZXlTZWNyZXQiOiJiYTk4NDQ3MjAyOGM1MzI5NjU0MDZlMGI2YjA0YWJiZTZkODlhOWQzODA5ZWQ1YTc3M2NjNjRlOWQ1MmQ0ZWEwIiwiaWF0IjoxNjk1Mjk2NTQyfQ`,
//             'Content-Type': 'application/json',
//         },
//         data: {
//             pinataOptions: { cidVersion: 0 },
//             pinataMetadata: { name: 'ip-metadata.json' },
//             pinataContent: jsonMetadata,
//         },
//     }

//     try {
//         const response = await axios(url, options)
//         return response.data.IpfsHash
//     } catch (error) {
//         console.error('Error uploading JSON to IPFS:', error)
//         throw error
//     }
// }

// export async function uploadTextToIPFS(text: string): Promise<string> {
//     const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
//     const data = new FormData()
//     const buffer = Buffer.from(text, 'utf-8')
//     data.append('file', buffer, { filename: 'dispute-evidence.txt', contentType: 'text/plain' })

//     const options = {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MmUzNjU1OS0wMjllLTQ5OTctYmJlOS02NDAxMGNhNzY2YWYiLCJlbWFpbCI6Im9ta2FyamFkaGF2MjEwM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2Y1OTcyOGU1MjRhNjQ4ZDQ0OTkiLCJzY29wZWRLZXlTZWNyZXQiOiJiYTk4NDQ3MjAyOGM1MzI5NjU0MDZlMGI2YjA0YWJiZTZkODlhOWQzODA5ZWQ1YTc3M2NjNjRlOWQ1MmQ0ZWEwIiwiaWF0IjoxNjk1Mjk2NTQyfQ`,
//             ...data.getHeaders(),
//         },
//         data: data,
//     }

//     try {
//         const response = await axios(url, options)
//         return response.data.IpfsHash
//     } catch (error) {
//         console.error('Error uploading text to IPFS:', error)
//         throw error
//     }
// }



import axios from 'axios'

// Pinata API configuration
const PINATA_API_KEY = '3f59728e524a648d4499'
const PINATA_SECRET_KEY = 'ba98447202bc532965406e0b6b04abbe6d89a9d3809ed5a773cc64e9d52d4ea0'
const PINATA_JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MmUzNjU1OS0wMjllLTQ5OTctYmJlOS02NDAxMGNhNzY2YWYiLCJlbWFpbCI6Im9ta2FyamFkaGF2MjEwM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2Y1OTcyOGU1MjRhNjQ4ZDQ0OTkiLCJzY29wZWRLZXlTZWNyZXQiOiJiYTk4NDQ3MjAyOGM1MzI5NjU0MDZlMGI2YjA0YWJiZTZkODlhOWQzODA5ZWQ1YTc3M2NjNjRlOWQ1MmQ0ZWEwIiwiaWF0IjoxNjk1Mjk2NTQyfQ`

/**
 * Upload JSON metadata to IPFS using Pinata
 * Browser-compatible version that works in React apps
 */
export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
    
    const data = {
        pinataOptions: { 
            cidVersion: 0 
        },
        pinataMetadata: { 
            name: `ip-metadata-${Date.now()}.json`,
            keyvalues: {
                type: 'ip-metadata',
                timestamp: new Date().toISOString()
            }
        },
        pinataContent: jsonMetadata,
    }

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': PINATA_JWT,
                'Content-Type': 'application/json',
            },
        })
        
        console.log('JSON uploaded to IPFS successfully:', response.data.IpfsHash)
        return response.data.IpfsHash
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error)
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data)
            console.error('Response status:', error.response?.status)
        }
        throw new Error('Failed to upload JSON to IPFS')
    }
}

/**
 * Upload text content to IPFS using Pinata
 * Browser-compatible version using FormData API
 */
export async function uploadTextToIPFS(text: string): Promise<string> {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
    
    // Create a browser-compatible FormData object
    const formData = new FormData()
    
    // Create a Blob from the text (browser-compatible)
    const blob = new Blob([text], { type: 'text/plain' })
    
    // Append the blob as a file
    formData.append('file', blob, `dispute-evidence-${Date.now()}.txt`)
    
    // Add Pinata options
    formData.append('pinataOptions', JSON.stringify({
        cidVersion: 0
    }))
    
    // Add Pinata metadata
    formData.append('pinataMetadata', JSON.stringify({
        name: `dispute-evidence-${Date.now()}.txt`,
        keyvalues: {
            type: 'dispute-evidence',
            timestamp: new Date().toISOString()
        }
    }))

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Authorization': PINATA_JWT,
                // Don't set Content-Type for FormData - let the browser set it
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        })
        
        console.log('Text uploaded to IPFS successfully:', response.data.IpfsHash)
        return response.data.IpfsHash
    } catch (error) {
        console.error('Error uploading text to IPFS:', error)
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data)
            console.error('Response status:', error.response?.status)
        }
        throw new Error('Failed to upload text to IPFS')
    }
}

/**
 * Upload a file to IPFS using Pinata
 * Accepts File objects from file inputs
 */
export async function uploadFileToIPFS(file: File, metadata?: Record<string, any>): Promise<string> {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
    
    const formData = new FormData()
    formData.append('file', file)
    
    // Add Pinata options
    formData.append('pinataOptions', JSON.stringify({
        cidVersion: 0
    }))
    
    // Add Pinata metadata
    formData.append('pinataMetadata', JSON.stringify({
        name: file.name,
        keyvalues: {
            type: 'user-upload',
            filename: file.name,
            size: file.size.toString(),
            timestamp: new Date().toISOString(),
            ...metadata
        }
    }))

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Authorization': PINATA_JWT,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        })
        
        console.log('File uploaded to IPFS successfully:', response.data.IpfsHash)
        return response.data.IpfsHash
    } catch (error) {
        console.error('Error uploading file to IPFS:', error)
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data)
            console.error('Response status:', error.response?.status)
        }
        throw new Error('Failed to upload file to IPFS')
    }
}

/**
 * Get file from IPFS using the hash
 */
export function getIPFSUrl(hash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${hash}`
}

/**
 * Fetch content from IPFS
 */
export async function fetchFromIPFS(hash: string): Promise<any> {
    const url = getIPFSUrl(hash)
    
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error('Error fetching from IPFS:', error)
        throw new Error('Failed to fetch content from IPFS')
    }
}

/**
 * Upload image to IPFS and return the hash
 * Useful for IP asset images
 */
export async function uploadImageToIPFS(imageFile: File): Promise<string> {
    if (!imageFile.type.startsWith('image/')) {
        throw new Error('File must be an image')
    }
    
    return uploadFileToIPFS(imageFile, {
        category: 'ip-asset-image',
        mimeType: imageFile.type
    })
}

/**
 * Create a metadata object for IP assets
 */
export function createIPMetadata(params: {
    name: string
    description: string
    imageHash?: string
    externalUrl?: string
    attributes?: Array<{ trait_type: string; value: string | number }>
    creator?: string
    license?: string
}): any {
    const metadata = {
        name: params.name,
        description: params.description,
        created_at: new Date().toISOString(),
        ...( params.imageHash && { image: getIPFSUrl(params.imageHash) }),
        ...( params.externalUrl && { external_url: params.externalUrl }),
        ...( params.attributes && { attributes: params.attributes }),
        ...( params.creator && { creator: params.creator }),
        ...( params.license && { license: params.license }),
    }
    
    return metadata
}

export default {
    uploadJSONToIPFS,
    uploadTextToIPFS,
    uploadFileToIPFS,
    uploadImageToIPFS,
    getIPFSUrl,
    fetchFromIPFS,
    createIPMetadata
}