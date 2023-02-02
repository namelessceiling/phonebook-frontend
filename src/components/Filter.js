const Filter = (props) => {
    return(
        <label>filter shown with <input value={props.value} onChange={props.onChange}/></label>
    );
}

export default Filter;