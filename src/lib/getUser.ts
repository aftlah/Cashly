// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// export async function getUserProfile() {
//     const supabase = createClientComponentClient();

//     const {
//         data: { user },
//         error: userError,
//     } = await supabase.auth.getUser();

//     if (userError) throw userError;
//     if (!user) throw new Error('User not logged in');

//     const { data, error } = await supabase
//         .from('profiles')
//         .select('username')
//         .eq('id', user.id)
//         .single();

//     if (error) throw error;

//     return {
//         user,
//         username: data.username,
//     };
// }



import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Cookies from 'js-cookie'

export async function getUserProfile() {
    const supabase = createClientComponentClient()

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('User not logged in')

    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

    if (error) throw error

    Cookies.set('user-username', data.username, { expires: 3 })

    return {
        user,
        username: data.username,
    }
}
