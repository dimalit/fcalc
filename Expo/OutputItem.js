import { StaticMathField } from 'react-mathquill'

import { useState } from "react"

export default function OutputItem(props){
    return(
        <>
            <StaticMathField>{props.latex}</StaticMathField>
        </>
    );
}
