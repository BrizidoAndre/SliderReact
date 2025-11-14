import React, {useId} from 'react';

const Radio = ({value, setValue, label, defaultChecked=false}) => {
    const id = useId();
    return (
            <div className="form-check">
                <input defaultChecked={defaultChecked} className="form-check-input" onChange={setValue} type="radio" name="flexRadioDefault" id={id}/>
                <label className="form-check-label" htmlFor={id}>
                    {label}
                </label>
            </div>
    );
};

export default Radio;