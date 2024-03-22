let profiles={};
export function start_profile(profile)
{
    profiles[profile]=Date.now();
}

export function end_profile(profile)
{
    return(Date.now()-profiles[profile]);
}