import { Skeleton } from '@mui/material';
import { useThemeContext } from '../Context/ThemeContext';
import { dark } from '@mui/material/styles/createPalette';

export const PostSkeleton = () => {
    return (
        <div style={{padding: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Skeleton variant="circular" width={45} height={45} sx={{marginRight: '10px'}} />
                <div>
                    <Skeleton variant="rectangular" width={200} height={8} sx={{marginBottom: '6px', borderRadius: '4px'}} />
                    <Skeleton variant="rectangular" width={60} height={8} sx={{borderRadius: '4px'}} />
                </div>
            </div>
            <Skeleton variant="rectangular" width={'100%'} height={300} sx={{margin: '15px 0', borderRadius: '4px'}} />
            <Skeleton variant="rectangular" width={'100%'} height={8} sx={{marginBottom: '6px', borderRadius: '4px'}} />
            <Skeleton variant="rectangular" width={'50%'} height={8} sx={{borderRadius: '4px'}} />
        </div>
    );
}

export const CreatePostSkeleton = () => {
    return (
        <div style={{padding: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Skeleton variant="circular" width={50} height={50} sx={{marginRight: '10px'}} />
                <Skeleton variant="rectangular" width={200} height={8} sx={{borderRadius: '4px'}} />
            </div>
            <Skeleton variant="rectangular" width={'100%'} height={8} sx={{marginTop: '6px', borderRadius: '4px'}} />
        </div>
    );
}

export const AvatarSkeletonOne = () => {

    const { dark } = useThemeContext()

    return (
        <div style={{paddingBottom: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Skeleton variant="circular" width={35} height={35} sx={{marginRight: '10px', backgroundColor: dark && 'rgb(44, 44, 44)'}} />
                <Skeleton variant="rectangular"  height={8} sx={{marginBottom: '6px', borderRadius: '4px', width: '180px', backgroundColor: dark && 'rgb(44, 44, 44)'}} />
            </div>
        </div>
    );
}

export const AvatarSkeletonTwo = () => {
    return (
        <div style={{padding: '15px'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Skeleton variant="circular" width={35} height={35} sx={{marginRight: '10px'}} />
                <div>
                    <Skeleton variant="rectangular" width={100} height={8} sx={{marginBottom: '6px', borderRadius: '4px', backgroundColor: dark && 'rgb(44, 44, 44)'}} />
                    <Skeleton variant="rectangular" width={200} height={8} sx={{borderRadius: '4px', backgroundColor: dark && 'rgb(44, 44, 44)'}} />
                </div>
            </div>
        </div>
    );
}

export const AvatarSkeletonsOne = () => {
    return (
        <div>
            <AvatarSkeletonOne />
            <AvatarSkeletonOne />
            <AvatarSkeletonOne />
            <AvatarSkeletonOne />
            <AvatarSkeletonOne />
        </div>
    );
}

export const AvatarSkeletonsTwo = () => {
    return (
        <div>
            <AvatarSkeletonTwo />
            <AvatarSkeletonTwo />
            <AvatarSkeletonTwo />
            <AvatarSkeletonTwo />
        </div>
    );
}