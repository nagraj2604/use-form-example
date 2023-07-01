import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import './App.css';

const customers = [
  {
    name: 'Person A',
    id: 'a'
  },
  {
    name: 'Person B',
    id: 'b'
  },
  {
    name: 'Person C',
    id: 'c'
  },
]
const schema = yup.object().shape({
  selectAll: yup.boolean().when('blessed', {
    is: (value) => value.length === 0 && value.length !== customers.length,
    then: (schema) =>
      schema.oneOf([true], 'select for full')
  }),
  blessed: yup.array().when('selectAll', {
    is: false,
    then: (schema) => schema.max(1, 'can select one')
  }),
}, ['blessed', 'selectAll'])

function App() {

  const { register, setValue, clearErrors, handleSubmit, formState: { errors } } = useForm(({
    resolver: yupResolver(schema),
    defaultValues: {
      blessed: []
    }
  }))
  const selectAllHandler = (value) => {
    if (value) {
      setValue('blessed', customers.map((customer) => customer.id));
      console.log('errors', errors)
    } else {
      setValue('blessed', []);
    }
    clearErrors(['blessed', 'selectAll'])
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit((data) => { console.log(data) })}>
        <div>
          <label> Select All</label>
          <input type="checkbox" id='selectAll'  {...register('selectAll')} onChange={(e) => selectAllHandler(e.target.checked)} />
        </div>
        <p style={{ color: 'red' }}>{errors?.selectAll?.message}</p>
        <p style={{ color: 'red' }}>{errors?.blessed?.message}</p>

        {customers.map((customer) => (
          <div key={customer.name}>
            <div>
              <p>Name : {customer.name}</p>
            </div>
            <div>
              <label> Blessed</label>
              <input type="checkbox" id={`blessed-${customer.id}`} {...register('blessed')} value={customer.id} onChange={() => clearErrors('selectAll')} />
            </div>
          </div>
        ))}
        <input type='submit' />
      </form>
    </div>
  );
}

export default App;
