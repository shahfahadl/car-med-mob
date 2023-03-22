import FirebaseService from '@utility/services/firebase';
import { collection, query, where,doc, getDoc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useAuth } from "@contexts/auth"

export const orderUserPending = () => {
    const { user } = useAuth();
    const [value, loading, error] = (FirebaseService.firestore && user?.id)?
        useCollection(
            query(collection(FirebaseService.firestore, 'orders'), 
                where("userId", "==", user.id),
                where("status", "==", "pending")),
            {
                snapshotListenOptions: { includeMetadataChanges: true },
            })
        : [[], true, null]

    const data = useMemo(() => {
        const values = [];

        if (value) {
            value.forEach(doc => values.push({...doc.data() , id: doc.id }));
        }

        return values;
    }, [value]);

    return { data, loading, error }
}

export const orderUser = async (id) => {

    const [value, loading, error] = await (async () => {
        if (FirebaseService.firestore && id) {
          try {
            const docRef = doc(FirebaseService.firestore, 'orders', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              return [docSnap.data(), false, null];
            } else {
              return [{}, false, new Error('Document does not exist')];
            }
          } catch (error) {
            return [{}, false, error];
          }
        }
    })
        console.log(value)

    const data = useMemo(() => {
        if(value){
            return { 
                bid : 8888,
                carType : "test",
                location : "Not available for now",
                problem : "Order",
                rating : 0,
                review : "",
                status : "process",
                userId : "63e3a4999fcab7170c1d2001",
                userName : "shayan",
                vendorId : "63f7eadd6988e41d9056e555",
                vendorName : "shayan",
             }
        }else{
            return {}
        }
    }, [value, loading, error]);

    return { value }
}

export const orderUserProcess = () => {
    const { user } = useAuth();
    const [value, loading, error] = (FirebaseService.firestore && user?.id)?
        useCollection(
            query(collection(FirebaseService.firestore, 'orders'), 
                where("userId", "==", user.id),
                where("status", "==", "process")),
            {
                snapshotListenOptions: { includeMetadataChanges: true },
            })
        : [[], true, null]

    const data = useMemo(() => {
        const values = [];

        if (value) {
            value.forEach(doc => values.push({...doc.data() , id: doc.id }) );
        }

        return values;
    }, [value]);

    return { data, loading, error }
}

export const orderUserCompleted = () => {
    const { user } = useAuth();
    const [value, loading, error] = (FirebaseService.firestore && user?.id)?
        useCollection(
            query(collection(FirebaseService.firestore, 'orders'), 
                where("userId", "==", user.id),
                where("status", "==", "completed")),
            {
                snapshotListenOptions: { includeMetadataChanges: true },
            })
        : [[], true, null]

    const data = useMemo(() => {
        const values = [];

        if (value) {
            value.forEach(doc =>{
                let order = doc.data()
                order.id = doc.id
                if(!order.rating){
                    values.push(order)
                }
            });
        }

        return values;
    }, [value]);

    return { data, loading, error }
}

export const orderVendorPending = () => {
    const { user } = useAuth();

    const [value, loading, error] = (FirebaseService.firestore)?
        useCollection(
            query(collection(FirebaseService.firestore, 'orders'), 
                where("status", "==", "pending")),
            {
                snapshotListenOptions: { includeMetadataChanges: true },
            })
        : [[], true, null]

    const data = useMemo(() => {
        const values = [];
        if (value) {
            value.forEach(doc => {
                let order = doc.data()
                order.id = doc.id
                if(!order.requests || !order.requests.find((request => request.vendorId === user.id ))){
                    values.push(order)
                }
            });
        }

        return values;
    }, [value]);

    return { data, loading, error }
}

export const orderVendorProcess = () => {
    const { user } = useAuth();
    const [value, loading, error] = (FirebaseService.firestore && user?.id)?
        useCollection(
            query(collection(FirebaseService.firestore, 'orders'), 
                where("vendorId", "==", user.id),
                where("status", "==", "process")),
            {
                snapshotListenOptions: { includeMetadataChanges: true },
            })
        : [[], true, null]

    const data = useMemo(() => {
        const values = [];
        if (value) {
            value.forEach(doc => {
                if(!doc.requests || !doc.requests.find((request => request.vendorId === user.id ))){
                    values.push({...doc.data() , id: doc.id })
                }
            });
        }

        return values;
    }, [value]);

    return { data, loading, error }
}