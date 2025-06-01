import { createClient } from "@/lib/supabase/client"
const supabase = createClient()

export type Transaction = {
    id: string;
    user_id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    created_at: string;
}

export interface NewTransactionPayload {
    user_id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string; // YYYY-MM-DD
    category: string;
}

export const getTransactions = async (userId: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
    if (!data) {
        console.warn('No transactions found for user:', userId);
        return [];
    }
    return data;
}

// export const getTransactionById = async (supabase: any, userId: string, transactionId: string) => {
//     const { data, error } = await supabase
//         .from('transactions')
//         .select('*')
//         .eq('user_id', userId)
//         .eq('id', transactionId)
//         .single();

//     if (error) {
//         console.error('Error fetching transaction:', error);
//         return null;
//     }
//     return data;
// }

export const createTransaction = async (payload: NewTransactionPayload): Promise<Transaction> => {
    // Anda bisa menambahkan validasi payload di sini jika diperlukan,
    // meskipun Zod sudah melakukannya di form.

    console.log('Creating transaction with payload:', payload);

    const { data, error } = await supabase
        .from('transactions') // Ganti 'transactions' dengan nama tabel Anda
        .insert([payload])    // Supabase insert mengharapkan array
        .select()             // Untuk mendapatkan kembali data yang baru saja di-insert
        .single();            // Karena kita insert satu record dan ingin satu record kembali

    if (error) {
        console.error('Supabase error creating transaction:', error);
        // Lempar error agar bisa ditangkap oleh pemanggil (misalnya di handleSubmit atau useMutation)
        throw new Error(error.message || 'Failed to create transaction.');
    }

    if (!data) {
        // Kasus ini seharusnya tidak terjadi jika insert berhasil dan tidak ada error jaringan
        console.error('No data returned after creating transaction, although no explicit error was thrown by Supabase.');
        throw new Error('Transaction might have been created, but no data was returned.');
    }

    // Kembalikan data transaksi yang baru dibuat (seperti yang dikembalikan oleh .select().single())
    return data as Transaction; // Lakukan type assertion jika perlu
};

export const updateTransaction = async (supabase: any, userId: string, transactionId: string, updates: any) => {
    const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('user_id', userId)
        .eq('id', transactionId)
        .single();

    if (error) {
        console.error('Error updating transaction:', error);
        return null;
    }
    return data;
}

export const deleteTransaction = async (supabase: any, userId: string, transactionId: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId)
        .eq('id', transactionId)
        .single();

    if (error) {
        console.error('Error deleting transaction:', error);
        return null;
    }
    return data;
}

export const getTransactionsByCategory = async (supabase: any, userId: string, category: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions by category:', error);
        return [];
    }
    return data;
}

export const getTransactionsByDateRange = async (supabase: any, userId: string, startDate: string, endDate: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions by date range:', error);
        return [];
    }
    return data;
}

export const getTransactionSummary = async (supabase: any, userId: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('category, sum(amount) as total_amount')
        .eq('user_id', userId)
        .group('category');

    if (error) {
        console.error('Error fetching transaction summary:', error);
        return [];
    }
    return data;
}


export const getTransactionCount = async (supabase: any, userId: string) => {
    const { count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching transaction count:', error);
        return 0;
    }
    return count || 0;
}

export const getTransactionTotal = async (supabase: any, userId: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('sum(amount) as total_amount')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching transaction total:', error);
        return 0;
    }
    return data?.total_amount || 0;
}

