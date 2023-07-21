
frappe.pages['deliveryy'].on_page_load = function(wrapper) {
  new MyPage(wrapper)
  // Fetch data from the server
  frappe.call({
    method: "alpha.alpha.page.deliveryy.__init__.get_delivery_page_data",
    callback: function(response) {
      if (response && response.message) {
        const data = response.message;
        render_bar_chart(data);
        // page_chart(data);
      }
    }
  });

  frappe.call({
    method: "alpha.alpha.page.deliveryy.__init__.get_delivery_page_data_amount",
    callback: function(response) {
      if (response && response.message) {
        const data = response.message;
        render_amount_chart(data);
        // page_chart(data);
      }
    }
  });
};

MyPage=Class.extend({
	init:function(wrapper){
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Delivery Challan',
			single_column: true
		});
		this.make();
	},
	// make page

	make:function(){
		//grab the class
		let me=$(this);

		let body='<div id="frost-chart"></div> <div id="chart-container"></div>';

		$(frappe.render_template(body,this)).appendTo(this.page.main)
		// page_chart();
	}
})

let render_bar_chart = function(data) {
  // Perform data aggregation to get total quantity for each product
  const groupedData = data.reduce((acc, item) => {
    const product = item.product;
    const qty = item.qty;

    if (!acc[product]) {
      acc[product] = 0;
    }
    acc[product] += qty;
    return acc;
  }, {});

  // Extract the product labels and total quantity values for the chart
  const productIds = Object.keys(groupedData);
  const values = Object.values(groupedData);

  // Fetch model numbers based on product IDs
  frappe.db.get_list('Product', {
    filters: { name: ['in', productIds] },
    fields: ['model_number']
  }).then(function(products) {
    const labels = products.map(item => item.model_number);
    
    const chartConfig = {
      data: {
        labels: labels,
        datasets: [
          {
            name: "Total Quantity Sold",
            chartType: "bar",
            values: values
          }
        ]
      },
      title: "Product Quantity Sold",
      type: "bar",
      height: 300,
      colors: ["purple"],
      tooltipOptions: {
        formatTooltipX: d => (d + "").toUpperCase(),
        formatTooltipY: d => d.toFixed(0)
      }
    };

    // Render the chart
    const chart = new frappe.Chart("#chart-container", chartConfig);
  }).catch(function(err) {
    console.error("Error fetching product model numbers:", err);
  });

};

let render_amount_chart = function(data) {
  // Perform data aggregation to get total quantity for each product
  const groupedData = data.reduce((acc, item) => {
    const product = item.product;
    const qty = item.billing_price;

    if (!acc[product]) {
      acc[product] = 0;
    }
    acc[product] += qty;
    return acc;
  }, {});

  // Extract the product labels and total quantity values for the chart
  const productIds = Object.keys(groupedData);
  const values = Object.values(groupedData);

  // Fetch model numbers based on product IDs
  frappe.db.get_list('Product', {
    filters: { name: ['in', productIds] },
    fields: ['model_number']
  }).then(function(products) {
    const labels = products.map(item => item.model_number);

    const chartConfig = {
      data: {
        labels: labels,
        datasets: [
          {
            name: "Total Quantity Sold",
            chartType: "bar",
            values: values
          }
        ]
      },
      title: "Product Amount Sold",
      type: "bar",
      height: 300,
      colors: ["purple"],
      tooltipOptions: {
        formatTooltipX: d => (d + "").toUpperCase(),
        formatTooltipY: d => d.toFixed(0)
      }
    };

    // Render the chart
    const chart = new frappe.Chart("#frost-chart", chartConfig);
  }).catch(function(err) {
    console.error("Error fetching product model numbers:", err);
  });
};

