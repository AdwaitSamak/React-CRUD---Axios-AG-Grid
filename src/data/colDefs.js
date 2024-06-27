import ButtonComp from "../comps/ButtonComp";

const commonColumnProps = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
    suppressHeaderMenuButton: true,
    unSortIcon: true,
  };

  const FilterParams = {
    buttons: ["apply", "reset", "clear"],
    closeOnApply: true,
  };

 const colDefs = [
    {
      headerName: "Id",
      field: "id",
      ...commonColumnProps,
      filterParams: FilterParams
    },
    {
      headerName: "Name",
      field: "name",
      ...commonColumnProps,
      filterParams: FilterParams,
    },
    {
      headerName: "Username",
      field: "username",
      filterParams: FilterParams,
      ...commonColumnProps
    },
    {
      headerName: "Email",
      field: "email",
      ...commonColumnProps,
      filterParams: FilterParams
    },
    {
      headerName: "Phone",
      field: "phone",
      ...commonColumnProps,
      filterParams: FilterParams
    },
    {
      headerName: "Country",
      field: "country",
      ...commonColumnProps,
      filterParams: FilterParams
    },
    {
      headerName: "Actions",
      cellRenderer: ButtonComp,
      cellRendererParams: (params) => ({ rowid: params.data.id }),
      sortable: false,
    },
  ];

  export default colDefs