import { v4 as uuidv4 } from 'uuid';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { heroCreated } from '../heroesList/heroesSlice';
import { useDispatch, useSelector } from 'react-redux';
import {useHttp} from '../../hooks/http.hook';
import {selectAll} from '../heroesFilters/filtersSlice';
import store from '../../store';
import './heroesAddForm.scss';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться --DONE
// Уникальный идентификатор персонажа можно сгенерировать через uiid --DONE
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST --DONE
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров --DONE

const HeroesAddForm = () => {

    // const [name, setName] = useState('');
    // const [descr, setDescr] = useState('');
    // const [element, setElement] = useState('');
    const filters = selectAll(store.getState());
    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const renderOptions = (arr, status) => { 
        if(status === 'loading') {
            return <option>Загрузка элементов</option>
        }else if(status === 'error') {
            return <option>Ошибка загрузки</option>
        }
        if(arr && arr.length > 0) {
            return arr.map((item, i) => {
                if(item.name === 'all') {
                    return null;
                }
                return (
                    <option key={i} value={item.name}>{item.label}</option>
                )
            })
        }
    }

    return (
        <Formik 
            initialValues = {{
                id: '',
                name: '',
                description: '',
                element: ''
            }}
            validationSchema = {Yup.object({
                name: Yup.string().min(2, 'Минимум 2 символа').required('Обязательное поле'),
                description: Yup.string().required('Обязательное поле'),
                element: Yup.string().required('Обязательное поле')
            })}
            onSubmit = {(hero, {resetForm}) => {
                hero.id = uuidv4();
                request("http://localhost:3001/heroes", 'POST', JSON.stringify(hero))
                    .then((data) => console.log(data))
                    .then(dispatch(heroCreated(hero)))
                    .finally(() => resetForm())
            }}
        >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" />
                </div>
                <ErrorMessage component="div" name="name" className="form-error" />

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        as="textarea"
                        name="description" 
                        className="form-control" 
                        id="text" 
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}/>
                </div>
                <ErrorMessage component="div" name="description" className="form-error" />

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field
                        as="select"
                        className="form-select" 
                        id="element"
                        name="element">
                        <option value=''>Я владею элементом...</option>
                        {renderOptions(filters, filtersLoadingStatus)}
                    </Field>
                </div>
                <ErrorMessage component="div" name="element" className="form-error" />
                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
        
    )
}

export default HeroesAddForm;


/* <form className="border p-4 shadow-lg rounded">
        <div className="mb-3">
            <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
            <input 
                required
                type="text" 
                name="name" 
                className="form-control" 
                id="name" 
                placeholder="Как меня зовут?"/>
        </div>

        <div className="mb-3">
            <label htmlFor="text" className="form-label fs-4">Описание</label>
            <textarea
                required
                name="text" 
                className="form-control" 
                id="text" 
                placeholder="Что я умею?"
                style={{"height": '130px'}}/>
        </div>

        <div className="mb-3">
            <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
            <select 
                required
                className="form-select" 
                id="element" 
                name="element">
                <option >Я владею элементом...</option>
                <option value="fire">Огонь</option>
                <option value="water">Вода</option>
                <option value="wind">Ветер</option>
                <option value="earth">Земля</option>
            </select>
        </div>

        <button type="submit" className="btn btn-primary">Создать</button>
    </form> */