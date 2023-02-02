const PersonForm = (props) => {
    return(
        <form onSubmit={props.onSubmit}>
            <div>
                name: <input value={props.name} onChange={props.nameChange}/>
            </div>
            <div>number: <input value={props.number} onChange={props.numberChange}/></div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
}

export default PersonForm;