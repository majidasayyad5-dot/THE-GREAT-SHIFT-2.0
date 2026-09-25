import React, { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import {
  BusinessProfile,
  BusinessLevelId,
  NavSection,
  BusinessAffairsData,
  SaleRecord,
  ProductRecord,
  CustomerRecord,
  ExpenseRecord,
  OrderRecord,
  SupplierRecord,
  TaskRecord,
  DocumentRecord,
} from '../../types/bi';
import { SalesView } from '../affairs/SalesView';
import { ProductsView } from '../affairs/ProductsView';
import { InventoryView } from '../affairs/InventoryView';
import { CustomersView } from '../affairs/CustomersView';
import { ExpensesView } from '../affairs/ExpensesView';
import { OrdersView } from '../affairs/OrdersView';
import { SuppliersView } from '../affairs/SuppliersView';
import { TasksView } from '../affairs/TasksView';
import { DocumentsView } from '../affairs/DocumentsView';
import { calculateAffairsDashboardMetrics } from '../../utils/affairsAnalyticsBridge';
import {
  DollarSign,
  Package,
  Boxes,
  Users,
  Receipt,
  ShoppingCart,
  Truck,
  CheckSquare,
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

interface ManageAffairsViewProps {
  profile: BusinessProfile;
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection) => void;
  businessAffairs: BusinessAffairsData;
  onUpdateAffairs: (data: BusinessAffairsData) => void;
  onSendToDiagnosticEngine?: () => void;
  initialTab?: AffairTab;
}

export type AffairTab =
  | 'overview'
  | 'sales'
  | 'products'
  | 'inventory'
  | 'customers'
  | 'expenses'
  | 'orders'
  | 'suppliers'
  | 'tasks'
  | 'documents';

export const ManageAffairsView: React.FC<ManageAffairsViewProps> = ({
  profile,
  selectedLevel,
  onNavigate,
  businessAffairs,
  onUpdateAffairs,
  onSendToDiagnosticEngine,
  initialTab = 'overview',
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<AffairTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const metrics = calculateAffairsDashboardMetrics(businessAffairs);

  // Handlers for Sales
  const handleAddSale = (sale: SaleRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      sales: [sale, ...businessAffairs.sales],
    });
  };
  const handleEditSale = (sale: SaleRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      sales: businessAffairs.sales.map((s) => (s.id === sale.id ? sale : s)),
    });
  };
  const handleDeleteSale = (id: string) => {
    onUpdateAffairs({
      ...businessAffairs,
      sales: businessAffairs.sales.filter((s) => s.id !== id),
    });
  };

  // Handlers for Products
  const handleAddProduct = (product: ProductRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      products: [product, ...businessAffairs.products],
    });
  };
  const handleEditProduct = (product: ProductRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      products: businessAffairs.products.map((p) => (p.id === product.id ? product : p)),
    });
  };
  const handleDeleteProduct = (id: string) => {
    onUpdateAffairs({
      ...businessAffairs,
      products: businessAffairs.products.filter((p) => p.id !== id),
    });
  };
  const handleUpdateProductStock = (productId: string, newStock: number) => {
    onUpdateAffairs({
      ...businessAffairs,
      products: businessAffairs.products.map((p) =>
        p.id === productId ? { ...p, currentStock: newStock } : p
      ),
    });
  };

  // Handlers for Customers
  const handleAddCustomer = (customer: CustomerRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      customers: [customer, ...businessAffairs.customers],
    });
  };
  const handleEditCustomer = (customer: CustomerRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      customers: businessAffairs.customers.map((c) => (c.id === customer.id ? customer : c)),
    });
  };
  const handleDeleteCustomer = (id: string) => {
    onUpdateAffairs({
      ...businessAffairs,
      customers: businessAffairs.customers.filter((c) => c.id !== id),
    });
  };

  // Handlers for Expenses
  const handleAddExpense = (expense: ExpenseRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      expenses: [expense, ...businessAffairs.expenses],
    });
  };
  const handleEditExpense = (expense: ExpenseRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      expenses: businessAffairs.expenses.map((e) => (e.id === expense.id ? expense : e)),
    });
  };
  const handleDeleteExpense = (id: string) => {
    onUpdateAffairs({
      ...businessAffairs,
      expenses: businessAffairs.expenses.filter((e) => e.id !== id),
    });
  };

  // Handlers for Orders
  const handleAddOrder = (order: OrderRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      orders: [order, ...businessAffairs.orders],
    });
  };
  const handleEditOrder = (order: OrderRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      orders: businessAffairs.orders.map((o) => (o.id === order.id ? order : o)),
    });
  };
  const handleDeleteOrder = (id: string) => {
    onUpdateAffairs({
      ...businessAffairs,
      orders: businessAffairs.orders.filter((o) => o.id !== id),
    });
  };

  // Handlers for Suppliers
  const handleAddSupplier = (supplier: SupplierRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      suppliers: [supplier, ...businessAffairs.suppliers],
    });
  };
  const handleEditSupplier = (supplier: SupplierRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      suppliers: businessAffairs.suppliers.map((s) => (s.id === supplier.id ? supplier : s)),
    });
  };
  const handleDeleteSupplier = (id: string) => {
    onUpdateAffairs({
      ...businessAffairs,
      suppliers: businessAffairs.suppliers.filter((s) => s.id !== id),
    });
  };

  // Handlers for Tasks
  const handleAddTask = (task: TaskRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      tasks: [task, ...businessAffairs.tasks],
    });
  };
  const handleEditTask = (task: TaskRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      tasks: businessAffairs.tasks.map((t) => (t.id === task.id ? task : t)),
    });
  };
  const handleDeleteTask = (id: string) => {
    onUpdateAffairs({
      ...businessAffairs,
      tasks: businessAffairs.tasks.filter((t) => t.id !== id),
    });
  };

  // Handlers for Documents
  const handleAddDocument = (doc: DocumentRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      documents: [doc, ...businessAffairs.documents],
    });
  };
  const handleEditDocument = (doc: DocumentRecord) => {
    onUpdateAffairs({
      ...businessAffairs,
      documents: businessAffairs.documents.map((d) => (d.id === doc.id ? doc : d)),
    });
  };
  const handleDeleteDocument = (id: string) => {
    onUpdateAffairs({
      ...businessAffairs,
      documents: businessAffairs.documents.filter((d) => d.id !== id),
    });
  };

  // Navigation tab items
  const tabs = [
    { id: 'overview', label: 'All Modules', icon: Layers, count: null },
    { id: 'sales', label: t.affairs.sales, icon: DollarSign, count: businessAffairs.sales.length },
    { id: 'products', label: t.affairs.products, icon: Package, count: businessAffairs.products.length },
    { id: 'inventory', label: t.affairs.inventory, icon: Boxes, count: businessAffairs.products.length },
    { id: 'customers', label: t.affairs.customers, icon: Users, count: businessAffairs.customers.length },
    { id: 'expenses', label: t.affairs.expenses, icon: Receipt, count: businessAffairs.expenses.length },
    { id: 'orders', label: t.affairs.orders, icon: ShoppingCart, count: businessAffairs.orders.length },
    { id: 'suppliers', label: t.affairs.suppliers, icon: Truck, count: businessAffairs.suppliers.length },
    { id: 'tasks', label: t.affairs.tasks, icon: CheckSquare, count: businessAffairs.tasks.length },
    { id: 'documents', label: t.affairs.documents, icon: FileText, count: businessAffairs.documents.length },
  ];

  const hasAnyAffairsData =
    businessAffairs.sales.length > 0 ||
    businessAffairs.products.length > 0 ||
    businessAffairs.expenses.length > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0B152F] text-white border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-semibold mb-1">
            <span>COMMERCIAL OPERATIONS</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400">BUSINESS AFFAIRS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.affairs.title}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {t.affairs.subtitle}
          </p>
        </div>

        {hasAnyAffairsData && onSendToDiagnosticEngine && (
          <button
            onClick={onSendToDiagnosticEngine}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.affairs.analytics_sync_button}</span>
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border border-slate-200 rounded-lg p-1.5 overflow-x-auto shadow-xs flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AffairTab)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Sales</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {metrics.totalSales !== null ? `$${metrics.totalSales.toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Expenses</span>
              <span className="text-base font-bold font-mono text-rose-700">
                {metrics.totalExpenses !== null ? `$${metrics.totalExpenses.toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Catalog SKUs</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {metrics.productCount !== null ? metrics.productCount : '0'}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Low Stock</span>
              <span className={`text-base font-bold font-mono ${metrics.lowStockCount ? 'text-amber-600' : 'text-slate-900'}`}>
                {metrics.lowStockCount !== null ? metrics.lowStockCount : '0'}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Pending Orders</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {metrics.pendingOrdersCount !== null ? metrics.pendingOrdersCount : '0'}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Customers</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {metrics.customerCount !== null ? metrics.customerCount : '0'}
              </span>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sales Card */}
            <div
              onClick={() => setActiveTab('sales')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {businessAffairs.sales.length} records
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                {t.affairs.sales}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.sales_desc}
              </p>
            </div>

            {/* Products Card */}
            <div
              onClick={() => setActiveTab('products')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {businessAffairs.products.length} SKUs
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                {t.affairs.products}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.products_desc}
              </p>
            </div>

            {/* Inventory Card */}
            <div
              onClick={() => setActiveTab('inventory')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <Boxes className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {metrics.lowStockCount ? `${metrics.lowStockCount} low stock` : 'Balanced'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                {t.affairs.inventory}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.inventory_desc}
              </p>
            </div>

            {/* Customers Card */}
            <div
              onClick={() => setActiveTab('customers')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {businessAffairs.customers.length} accounts
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                {t.affairs.customers}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.customers_desc}
              </p>
            </div>

            {/* Expenses Card */}
            <div
              onClick={() => setActiveTab('expenses')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-rose-50 text-rose-800 group-hover:bg-rose-800 group-hover:text-white transition-colors">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {businessAffairs.expenses.length} entries
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-800 transition-colors">
                {t.affairs.expenses}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.expenses_desc}
              </p>
            </div>

            {/* Orders Card */}
            <div
              onClick={() => setActiveTab('orders')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {businessAffairs.orders.length} orders
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                {t.affairs.orders}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.orders_desc}
              </p>
            </div>

            {/* Suppliers Card */}
            <div
              onClick={() => setActiveTab('suppliers')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {businessAffairs.suppliers.length} vendors
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                {t.affairs.suppliers}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.suppliers_desc}
              </p>
            </div>

            {/* Tasks Card */}
            <div
              onClick={() => setActiveTab('tasks')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {businessAffairs.tasks.length} to-dos
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                {t.affairs.tasks}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.tasks_desc}
              </p>
            </div>

            {/* Documents Card */}
            <div
              onClick={() => setActiveTab('documents')}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {businessAffairs.documents.length} files
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                {t.affairs.documents}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.affairs.documents_desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Specific Module Views */}
      {activeTab === 'sales' && (
        <SalesView
          sales={businessAffairs.sales}
          onAddSale={handleAddSale}
          onEditSale={handleEditSale}
          onDeleteSale={handleDeleteSale}
        />
      )}

      {activeTab === 'products' && (
        <ProductsView
          products={businessAffairs.products}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {activeTab === 'inventory' && (
        <InventoryView
          products={businessAffairs.products}
          onUpdateProductStock={handleUpdateProductStock}
          onNavigateToProducts={() => setActiveTab('products')}
        />
      )}

      {activeTab === 'customers' && (
        <CustomersView
          customers={businessAffairs.customers}
          onAddCustomer={handleAddCustomer}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpensesView
          expenses={businessAffairs.expenses}
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersView
          orders={businessAffairs.orders}
          onAddOrder={handleAddOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
        />
      )}

      {activeTab === 'suppliers' && (
        <SuppliersView
          suppliers={businessAffairs.suppliers}
          onAddSupplier={handleAddSupplier}
          onEditSupplier={handleEditSupplier}
          onDeleteSupplier={handleDeleteSupplier}
        />
      )}

      {activeTab === 'tasks' && (
        <TasksView
          tasks={businessAffairs.tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentsView
          documents={businessAffairs.documents}
          onAddDocument={handleAddDocument}
          onEditDocument={handleEditDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      )}
    </div>
  );
};
