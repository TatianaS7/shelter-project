import { Colors } from './Colors';

export const Buttons = {
    primaryOutline: {
        display: 'flex' as 'flex',        
        borderColor: Colors.light.tint,
        borderWidth: 1,
        height: 50,
        justifyContent: 'flex-start' as 'flex-start',    
    },
    primarySolid: {
        display: 'flex' as 'flex',        
        backgroundColor: Colors.light.tint,
        height: 'auto' as 'auto',
        justifyContent: 'flex-start' as 'flex-start',    
    },
    blackSolid: {
        display: 'flex' as 'flex',        
        backgroundColor: 'black' as 'black',
        height: 'auto' as 'auto',
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    boldText: {
        fontWeight: '600' as '600',
        fontSize: 16,
    },
}