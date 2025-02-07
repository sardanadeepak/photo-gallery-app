import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"

interface DocumentData {
    id: string,
    url: string,
    createdAt: any
}

interface UseFireStoreReturn {
    docs: DocumentData[],
    error: string | null
}

const useFireStore = (collectionName: string): UseFireStoreReturn => {
    const [docs, setDocs] = useState<DocumentData[]>([])
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const collectionRef = collection(projectFirestore, collectionName)

        const q = query(collectionRef, orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                let documents: DocumentData[] = []
                snapshot.forEach(doc => {
                    documents.push({ id: doc.id, ...doc.data() } as DocumentData)
                })
                setDocs(documents)
            },
            (err) => {
                setError(err.message)
                console.log('Error Rooer', err)
            }

        )
        return () => unsubscribe()

    }, [collectionName])

    return { docs, error }
}

export default useFireStore