const Person = ({person, onClick}) => {
    return <p>{person.name} {person.number}<span><button onClick={onClick}>delete</button></span></p>;
}

export default Person;