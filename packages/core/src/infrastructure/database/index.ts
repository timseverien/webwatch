import { database } from '@spectakel/infrastructure/src/firebase';

type FirestoreCollectionName = 'specifications' | 'feeds';

type Doc<T extends any> = {
	id: string;
	collection: string;
	data: T;
};

export const db = {
	specifications: database.collection('specifications'),
};

function toDoc<T extends any>(
	query:
		| FirebaseFirestore.DocumentSnapshot
		| FirebaseFirestore.QueryDocumentSnapshot,
	collection: keyof typeof db,
	normalize?: (obj: any) => T,
): Doc<T> {
	const data = query.data();
	return {
		id: query.id,
		collection: collection,
		data: normalize ? normalize(data) : (data as T),
	};
}
