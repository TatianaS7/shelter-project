import { Colors } from './Colors';

export const Buttons = {
    primaryOutline: {
        display: 'flex' as const,        
        borderColor: Colors.light.tint,
        backgroundColor: 'white' as const,
        borderWidth: 1,
        height: 50,
        borderRadius: 10,
        justifyContent: 'flex-start' as const,    
    },
    primarySolid: {
        display: 'flex' as const,        
        backgroundColor: Colors.light.tint,
        height: 50,
        borderRadius: 10,
        justifyContent: 'flex-start' as const,    
    },
    whiteSolid: {
        display: 'flex' as const,        
        backgroundColor: 'white' as const,
        height: 'auto' as const,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    blackSolid: {
        display: 'flex' as const,        
        backgroundColor: 'black' as const,
        height: 'auto' as const,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    boldText: {
        fontWeight: '600' as const,
        fontSize: 16,
    },
    buttonText: {
        color: Colors.light.text,
        marginLeft: 10,
        fontWeight: 500,
    }
}