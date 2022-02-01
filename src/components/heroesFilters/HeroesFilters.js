import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activeFilterChanged, fetchFilters } from './filtersSlice';
import Spinner from '../spinner/Spinner';
import classNames from 'classnames';
import { selectAll } from './filtersSlice';
import store from '../../store';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных --DONE
// Фильтры должны отображать только нужных героев при выборе --DONE
// Активный фильтр имеет класс active --DONE!!!
// Изменять json-файл для удобства МОЖНО! --DONE
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    // const {filters, activeFilter, filtersLoadingStatus} = useSelector(selectAll);
    const filters = selectAll(store.getState());
    const {activeFilter, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchFilters());
    }, [])

    if(filtersLoadingStatus === 'loading') {
        <Spinner />;
    }else if (filtersLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderButtons = (arr, status) => {
        return arr.map((item, i) => {
            const btnClass = classNames('btn', item.className, {'active': item.name === activeFilter});
            return (
                <button 
                    key={i}
                    value={item.name} 
                    onClick={() => {dispatch(activeFilterChanged(item.name))}} 
                    className={btnClass}
                    >{item.label}
                </button>
            )
        })
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {renderButtons(filters, filtersLoadingStatus)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;