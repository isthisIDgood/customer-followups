// Array of customers
const customers = getCustomers()

// Get DOM Elements
// const newCustomerNameDOM = document.querySelector('#customer-name')
const addCustForm = document.querySelector('#add-customer')
const customersSection = document.querySelector('#customers')
const customerModalBackground = document.querySelector('#customer-modal')
const followupModalBackground = document.querySelector('#follow-up-modal')
const customerConatiner = document.querySelector('#customer-container')
const followUpFormHTML = `<div>
                            <form action="" class="follow-up-form">
                                <input type="text" name="newFollowUp" class="form-input" autocomplete="off" placeholder="Enter a follow-up">
                                <button class="btn">Add</button>
                            </form>
                        </div>`

// Add Listener to Add Buttom
addCustForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (e.target.elements.customerName.value !== '') {
        addCustomer(customers, {
            name: e.target.elements.customerName.value.trim(),
            followUps: [],
            color: '',
            id: uuidv4()
        })
        e.target.elements.customerName.value = ''
        generateCustomersDOM(customers)
    }
})

// Render customers
function generateCustomersDOM(customers) {
    customersSection.innerHTML = ''
    customers.forEach((customer, index) => {
        //Overall Single Customer Div
        const customerDiv = document.createElement('div')
        //Customer Name
        const customerNameDOM = document.createElement('h3')
        customerNameDOM.textContent = customer.name
        customerNameDOM.classList.add('customer-title')
        //Remove Button
        const removeButton = document.createElement('button')
        removeButton.addEventListener('click', () => removeCustomer(customers, customer))
        removeButton.classList.add('fas', 'fa-trash', 'remove-cust', 'remove-btn')                  //<i class="fas fa-trash"></i> - https://fontawesome.com/icons/trash?style=solid
        //Edit Button
        const editButton = document.createElement('button')
        editButton.classList.add('btn')
        editButton.classList.add('edit-cust')
        editButton.classList.add('fas')                                                              //<i class="fas fa-edit"></i>
        editButton.classList.add('fa-pen')
        //Add Input for Follow-up Add and Style
        const followUpForm = document.createElement('form')
        followUpForm.innerHTML = followUpFormHTML
        followUpForm.classList.add('follow-up-form')
        followUpForm.addEventListener('submit', (e) => formSubmit(e, index))
        //Append to Overall Customer Div and Style
        customerDiv.appendChild(customerNameDOM)
        customerDiv.appendChild(generateFollowUps(customer))
        customerDiv.appendChild(removeButton)
        customerDiv.appendChild(editButton)
        customerDiv.appendChild(followUpForm)
        customerDiv.classList.add('customer-style')
        //Append to Customer Section
        editButton.addEventListener('click', () => loadCustomerModal(customer, customerDiv))        // Needs to be added at the end for styling
        setCustomerBackgroundColor(customer, customerDiv)
        customersSection.appendChild(customerDiv)
    })
}

// Create Follow-ups Div
function generateFollowUps(customer) {
    let followUpsDOM = document.createElement('div')
    customer.followUps.forEach((followUp) => {
        let followUpDiv = document.createElement('div')
        // Task Div
        let followUpDOM = document.createElement('div')
        followUpDOM.textContent = followUp.task
        followUpDOM.classList.add('follow-up')
        if (followUp.completedStatus) {
            followUpDOM.classList.add('completed-followup')
        }
        followUpDOM.addEventListener('click', () => {
            followUpDOM.classList.toggle('completed-followup')
            followUp.completedStatus = !followUp.completedStatus
            saveCustomers(customers)
        })
        // Button Div
        const btnDiv = document.createElement('div')
        // Edit Button
        const editButton = document.createElement('button')
        editButton.classList.add('btn', 'fas', 'fa-pen')
        // Remove Button
        const followUpBtn = document.createElement('button')
        followUpBtn.textContent = 'X'
        followUpBtn.classList.add('remove-btn', 'remove-follow-up')
        followUpBtn.addEventListener('click', () => removeFollowUp(customer, followUp))
        // Append Buttons
        btnDiv.append(editButton, followUpBtn)
        // Addpend to FollowUp Div & Style
        followUpDiv.appendChild(followUpDOM)
        followUpDiv.appendChild(btnDiv)
        followUpDiv.classList.add(followUp.priority.toLowerCase())
        followUpDiv.classList.add('follow-up-style')
        // Add to FollowUps Div
        followUpsDOM.appendChild(followUpDiv)
        followUpsDOM.classList.add('follow-up-list')
        editButton.onclick = () => editFollowup(followUpDiv, followUp, customer.id)
    })
    followUpsDOM.textContent === '' ? followUpsDOM.textContent = 'No Follow-ups!' : followUpsDOM = followUpsDOM
    return followUpsDOM
}

function editFollowup(sourceFollowUpDiv, followUpEdit, id) {
    const followUp = sourceFollowUpDiv.cloneNode(true)
    const btns = followUp.querySelectorAll('button')
    btns.forEach((btn) => {
        btn.remove()
    })
    const modalDiv = document.querySelector('.follow-up-modal')
    modalDiv.querySelector('#title').value = followUpEdit.task
    console.log(modalDiv.querySelector('#date').value)
    modalDiv.querySelector('#date').value = getDateForInput(followUpEdit.date)
    modalDiv.querySelector('#priority').value = followUpEdit.priority
    modalDiv.querySelector('#notes').value = followUpEdit.notes
    const saveBtn = document.querySelector('#save-follow-up')
    saveBtn.onclick = () => {

    }
    const followUpDiv = document.querySelector('#follow-up')
    followUpDiv.append(followUp)
    followupModalBackground.classList.add('modal-active')
}

function getTaskByCustomer(customers, custId, taskId) {
    const customer = getCustomerById(customers, custId)
    if (customer) {
        return getTaskById(customer.tasks, taskId)
    }
}

function getTaskById(tasks, id) {
    return tasks.find((task) => task.id === id)
}

function getCustomerById(customers, id) {
    return customers.find((customer) => customer.id === id)
}

// Add customer to customers array
function addCustomer(customerArray, customer) {
    customerArray.push(customer)
    saveCustomers(customers)
}

// Remove customer from customers array
function removeCustomer(customerArray, customerRemove) {
    let index = 0
    customerArray.forEach((customer, i) => {
        if (customer.id === customerRemove.id) {
            index = i
        }
    })
    customerArray.splice(index, 1)
    saveCustomers(customers)
    generateCustomersDOM(customers)
}

// Add Follow-up to followUps property
function addFollowUp(customer, followUp) {
    customer.followUps.push(followUp)
    saveCustomers(customers)
}

// Remove Follow-up from followUps property
function removeFollowUp(customer, followUpRemove) {
    let index = -1
    customer.followUps.forEach((followUp, i) => {
        if (followUp.id === followUpRemove.id) {
            index = i
        }
    })
    if (index !== -1) {
        customer.followUps.splice(index, 1)
    }
    saveCustomers(customers)
    generateCustomersDOM(customers)
}


function formSubmit(event, index) {
    event.preventDefault()
    if (event.target.elements.newFollowUp.value !== '') {
        const today = new Date()
        addFollowUp(customers[index], {
            task: event.target.elements.newFollowUp.value,
            priority: 'Medium',
            dueDate: today, //`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,       //Default Due Date to Today
            completedStatus: false,
            notes: '',
            id: uuidv4()
        })
        generateCustomersDOM(customers)
    }
}

function getDateForInput(date) {
    return moment(date).format('YYYY-MM-DD')
}

// Generate Modal for given customer
function loadCustomerModal(customer, customerDiv) {
    // Pull Div to Hold Customer Info and Style
    const modalDiv = document.querySelector('.cust-modal')
    // Pull Container Div for spacing
    const modalContainer = document.querySelector('#modal-container')
    // Copy customerDiv for modal
    const customerInfoDiv = customerDiv.cloneNode(true)
    // Remove buttons and form, then style
    removeButtons(customerInfoDiv.querySelectorAll('button'))
    customerInfoDiv.querySelector('form').remove()
    customerInfoDiv.classList.add('customer-style')
    // Name Field
    const custNameField = document.querySelector('#name')
    custNameField.value = customer.name
    custNameField.classList.add('modal-input')
    const defaultText = customerInfoDiv.children[0].textContent
    custNameField.addEventListener('input', (e) => {
        if (e.target.value.length !== 0) {
            customerInfoDiv.children[0].textContent = e.target.value
        } else {
            customerInfoDiv.children[0].textContent = defaultText
        }
    })
    // Color Field
    const custColorField = document.querySelector('#color')
    custColorField.value = customer.color
    custColorField.classList.add('modal-input')
    custColorField.addEventListener('input', (e) => {
        customerInfoDiv.style.backgroundColor = e.target.value
    })
    // Add and remove listener to form
    const modalForm = document.querySelector('#cust-change')
    const onSubmit = (e) => {
        updateCustomerInfo({ e, customer, modalDiv })
        modalForm.removeEventListener('submit', onSubmit)
    }
    modalForm.addEventListener('submit', onSubmit)
    // Add Close Button
    const closeButton = document.createElement('span')
    closeButton.textContent = 'X'
    closeButton.id = 'close'
    closeButton.addEventListener('click', () => {
        customerModalBackground.classList.remove('modal-active')
        modalDiv.querySelector('.customer-style').remove()
        modalDiv.querySelector('#close').remove()
        modalForm.removeEventListener('submit', onSubmit)           //Remove Event Listener otherwise break
    })
    // Append to Overall Div and Style
    customerConatiner.prepend(customerInfoDiv)
    modalContainer.appendChild(closeButton)
    modalDiv.appendChild(modalContainer)
    modalDiv.classList.add('modal')
    // Append to modalBackground and Style
    customerModalBackground.classList.add('modal-active')
    customerModalBackground.appendChild(modalDiv)
}

// Update Customer Object with input values
function updateCustomerInfo({ e, customer, modalDiv }) {
    e.preventDefault()
    if (e.target.elements.name.value !== '') {
        customer.name = e.target.elements.name.value
    }
    if (e.target.elements.color.value !== '#000000') {
        customer.color = e.target.elements.color.value
    }
    generateCustomersDOM(customers)
    saveCustomers(customers)
    modalDiv.querySelector('.customer-style').remove()
    customerModalBackground.classList.remove('modal-active')
    document.querySelector('#close').remove()
}

// Set Color Property
function setCustomerBackgroundColor(customer, div) {
    if (customer.color !== '') {
        div.style.backgroundColor = customer.color
    }
}

// Remove buttons for modal style
function removeButtons(buttonList) {
    for (let i = 0; i < buttonList.length; i++) {
        buttonList[i].remove()
    }
}

// Retrive Followups from Local Storage
function getCustomers() {
    const followUpsJSON = localStorage.getItem('followups')
    try {
        return (followUpsJSON) ? JSON.parse(followUpsJSON) : []
    }
    catch {
        return []
    }
}

// Save FollowUps to Local Storage
function saveCustomers(customers) {
    localStorage.setItem('followups', JSON.stringify(customers))
}

// Initial Render
generateCustomersDOM(customers)