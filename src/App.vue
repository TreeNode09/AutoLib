<template>
<router-view/>
</template>

<style>
*
{
    box-sizing: border-box;
}

body
{
    margin: 0;

    --grey-pale: #EEE;
    --grey-main: #AAA;
    --grey-dark: #444;

    --red-pale: #FCC;
    --red-main: #C00;
    --red-dark: #800;
}

h1, h2, h3
{
    margin: 0 0 10px 0;
}

h4, h5, h6
{
    margin: 0 0 5px 0;
}

button, input
{
    font-size: large;

    margin-bottom: 10px;
}

button.red
{
    border: 1px solid var(--red-dark);
    border-radius: 2px;
    background-color: var(--red-pale);
}

button.red:hover
{
    color: #FFF;
    background-color: var(--red-main);
}

small
{
    color: var(--red-main)
}

table
{
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--grey-dark);
    background-color: #FFF;
}

thead
{
    background-color: var(--grey-pale);
}

th
{
    border-bottom: 1px solid var(--grey-main);
}

th, td
{
    text-align: center;
    padding: 1px 5px;
}

tbody:nth-of-type(even) > tr, tr:nth-of-type(even)
{
    background-color: var(--grey-pale);
}

.out
{
    display: inline-flex;
    flex-direction: column;

    height: calc(100vh - 20px);
    padding: 10px;

    border: 1px solid var(--grey-main);
    border-radius: 10px;
    background-color: var(--grey-pale); 
}

.table-out
{
    overflow: auto;
    max-width: 100%;
    border: 1px solid var(--grey-dark)
}

.right
{
    float: right;
}
</style>
